# {{ .Title }}

Source: {{ (.OutputFormats.Get "html").Permalink }}
{{ if eq .Section "api" }}
{{ range site.Data.api.namespaces }}
## {{ .name }}

{{ range .groups }}### {{ .label }}

{{ range .items }}- [{{ .name }}]({{ printf "api/%s.md" .path | absURL }})
{{ end }}
{{ end }}{{ end }}
{{ else }}
{{ $path := .Path }}
{{ range partialCached "docs-groups.html" . .Lang }}{{ if or (eq $path "/docs") (eq .section.Path $path) }}
## {{ .title }}

{{ range .pages }}{{ if ne .Kind "section" }}- [{{ .Title }}]({{ (.OutputFormats.Get "markdown").Permalink }}){{ with .Summary | plainify | htmlUnescape | strings.TrimSpace }}: {{ . | truncate 160 | htmlUnescape }}{{ end }}
{{ end }}{{ end }}{{ end }}{{ end }}
{{ end }}
