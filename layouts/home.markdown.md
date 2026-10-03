# {{ .Title }}

Source: {{ (.OutputFormats.Get "html").Permalink }}

{{ partial "markdown-body.html" . }}
