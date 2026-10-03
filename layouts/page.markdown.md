# {{ .Title }}

{{ with .Params.apiKind }}Kind: {{ . }}  
{{ end }}{{ with .Params.apiNamespace }}Namespace: `{{ . }}`  
{{ end }}{{ with .Params.apiAssembly }}Assembly: `{{ . }}`  
{{ end }}Source: {{ (.OutputFormats.Get "html").Permalink }}

{{ partial "markdown-body.html" . }}
