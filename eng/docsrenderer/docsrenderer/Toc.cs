namespace docsrenderer;

sealed class Toc {
    public TocItem [] Items { get; set; } = Array.Empty<TocItem> ();
}

sealed class TocItem {
    public required string Name { get; set; }
    public string? Href { get; set; }
}
