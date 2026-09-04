#!/usr/bin/env ruby

require "json"
require "optparse"
require "pathname"
require "yaml"
require "date"

options = {}
OptionParser.new do |parser|
  parser.on("--server DIR", "WES-Server checkout used for migration comparison") { |value| options[:server] = value }
  parser.on("--openapi FILE", "OpenAPI JSON used for documented API comparison") { |value| options[:openapi] = value }
  parser.on("--extract-mermaid DIR", "Write Mermaid blocks to a directory for mmdc") { |value| options[:mermaid] = value }
end.parse!

root = Pathname(__dir__).parent
markdown_files = ([root.join("index.md")] + root.join("docs").glob("**/*.md")).sort
errors = []
titles = {}
pages = []
mermaid_blocks = []

markdown_files.each do |path|
  text = path.read
  match = text.match(/\A---\s*\n(.*?)\n---\s*\n/m)
  unless match
    errors << "#{path.relative_path_from(root)}: front matter가 없다"
    next
  end

  begin
    front_matter = YAML.safe_load(match[1], permitted_classes: [Date], aliases: true) || {}
  rescue StandardError => error
    errors << "#{path.relative_path_from(root)}: front matter 파싱 실패: #{error.message}"
    next
  end

  title = front_matter["title"]
  errors << "#{path.relative_path_from(root)}: title이 없다" unless title
  titles[title] = path if title
  pages << [path, front_matter]

  mermaid_open = false
  current = []
  text.each_line do |line|
    if !mermaid_open && line.match?(/^```mermaid\s*$/)
      mermaid_open = true
      current = []
    elsif mermaid_open && line.match?(/^```\s*$/)
      mermaid_blocks << [path, current.join]
      mermaid_open = false
    elsif mermaid_open
      current << line
    end
  end
  errors << "#{path.relative_path_from(root)}: Mermaid 코드 펜스가 닫히지 않았다" if mermaid_open

  text.scan(/\[[^\]]+\]\(([^)]+)\)/).flatten.each do |target|
    next if target.start_with?("http://", "https://", "mailto:", "#", "{{", "codex:")
    clean = target.split("#", 2).first
    next if clean.empty?
    resolved = path.dirname.join(clean).cleanpath
    errors << "#{path.relative_path_from(root)}: 링크 대상 없음 #{target}" unless resolved.exist?
  end
end

pages.each do |path, front_matter|
  parent = front_matter["parent"]
  next unless parent
  errors << "#{path.relative_path_from(root)}: parent '#{parent}' 페이지가 없다" unless titles.key?(parent)
end

if options[:mermaid]
  destination = Pathname(options[:mermaid])
  destination.mkpath
  mermaid_blocks.each_with_index do |(path, content), index|
    name = path.relative_path_from(root).to_s.tr("/", "-").sub(/\.md\z/, "")
    destination.join(format("%s-%02d.mmd", name, index + 1)).write(content)
  end
end

if options[:server]
  migration_dir = Pathname(options[:server]).join("src/main/resources/db/migration")
  unless migration_dir.directory?
    errors << "Server migration 경로가 없다: #{migration_dir}"
  else
    tables = []
    migration_dir.glob("V*.sql").sort_by { |path| path.basename.to_s[/\AV(\d+)/, 1].to_i }.each do |path|
      sql = path.read
      sql.scan(/CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+(?:public\.)?([a-z0-9_]+)/i) { |name| tables << name.first.downcase }
      sql.scan(/DROP\s+TABLE(?:\s+IF\s+EXISTS)?\s+(?:public\.)?([a-z0-9_]+)/i) { |name| tables.delete(name.first.downcase) }
    end
    tables.uniq!

    entities = []
    root.join("docs/data-model").glob("*.md").each do |path|
      in_erd = false
      path.each_line do |line|
        in_erd = true if line.match?(/^```mermaid\s*$/)
        in_erd = false if in_erd && line.match?(/^```\s*$/)
        next unless in_erd
        if (relation = line.match(/^\s*([A-Z][A-Z0-9_]*)\s+[^\s]+--[^\s]+\s+([A-Z][A-Z0-9_]*)\s*:/))
          entities.concat([relation[1], relation[2]])
        elsif (declaration = line.match(/^\s*([A-Z][A-Z0-9_]*)\s+\{\s*$/))
          entities << declaration[1]
        end
      end
    end

    entities.map!(&:downcase)
    entities.uniq!
    (entities - tables).sort.each { |name| errors << "ERD 테이블이 최종 Flyway 스키마에 없다: #{name}" }

    %w[photo_folder_groups photo_folders photo_folder_items admin_album_templates collab_guests].each do |name|
      errors << "삭제 대상 테이블이 최종 Flyway 스키마에 남았다: #{name}" if tables.include?(name)
    end
  end
end

if options[:openapi]
  specification = JSON.parse(Pathname(options[:openapi]).read)
  paths = specification.fetch("paths", {}).keys
  documented = root.join("docs/data-model").glob("*.md").flat_map do |path|
    path.read.scan(/`(\/(?:api\/v1|internal\/admin\/v1)[^` ,]*)`/).flatten
  end.uniq
  documented.each do |prefix|
    errors << "문서 API가 OpenAPI에 없다: #{prefix}" unless paths.any? { |path| path == prefix || path.start_with?("#{prefix}/") }
  end
end

if errors.empty?
  puts "문서 검증 통과: Markdown #{markdown_files.length}개, Mermaid #{mermaid_blocks.length}개"
  exit 0
end

warn errors.join("\n")
exit 1
