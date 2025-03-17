using System.Diagnostics;
using System.Text;
using System.Text.RegularExpressions;
using CommandLine;
using Markdig;
using YamlDotNet.Serialization;

namespace docsrenderer {
    internal class Program {

        static Regex TranslationsExcludeRegex = new Regex ( @"[\\/](pt-br|ru|es|cn)[\\/]", RegexOptions.Compiled | RegexOptions.IgnoreCase );
        static string CurrentDirectory = string.Empty;
        static IDeserializer YamlDeserializer = new DeserializerBuilder ()
            .WithNamingConvention ( YamlDotNet.Serialization.NamingConventions.LowerCaseNamingConvention.Instance )
            .Build ();
        static MarkdownPipeline MarkdownPipe = new MarkdownPipelineBuilder ()
            .UseGridTables ()
            .UsePipeTables ()
            .UseAlertBlocks ()
            .Build ();

        static int Main ( string [] args ) {
            var cmdParser = new CommandLine.CommandLineParser ( args );
            var mode = cmdParser.GetValue ( "mode", 'm' );
            var directoryPath = cmdParser.GetValue ( "docs-directory", 'd' );

            if (directoryPath != null)
                Directory.SetCurrentDirectory ( directoryPath );

            if (mode == "help") {
                return RenderHelp ( cmdParser );
            }
            else if (mode == "api") {

            }

            return 0;
        }

        static string NormalizePath ( string path ) {
            return path.Replace ( '/', Path.DirectorySeparatorChar ).Replace ( '\\', Path.DirectorySeparatorChar );
        }

        static int RenderHelp ( CommandLineParser cmdLine ) {
            var format = Enum.Parse<OutputFormat> ( cmdLine.GetValue ( "format", 'f' ) ?? "md", ignoreCase: true );
            var output = cmdLine.GetValue ( "output", 'o' );
            var language = cmdLine.GetValue ( "lang", 'l' );

            string helpDirectory = Path.Combine ( CurrentDirectory, "docs" );
            if (!Directory.Exists ( helpDirectory )) {
                Console.WriteLine ( $"The specified input directory does not exists." );
                return 1;
            }

            string [] helpFiles = Directory.GetFiles ( helpDirectory, "*.*", SearchOption.AllDirectories );
            string? yamlToc = helpFiles.FirstOrDefault ( h => h.EndsWith ( ".yml", StringComparison.OrdinalIgnoreCase ) );
            if (yamlToc is null) {
                Console.WriteLine ( $"The specified input directory does not appear to be the Sisk documentation repository root." );
                return 1;
            }

            if (language == null) {
                helpFiles = helpFiles
                    .Where ( h => !TranslationsExcludeRegex.IsMatch ( h ) )
                    .Where ( h => h.EndsWith ( ".md" ) )
                    .ToArray ();
            }
            else {
                helpFiles = helpFiles
                    .Where ( h => Regex.IsMatch ( h, $@"[\\/]{language}[\\/]", RegexOptions.IgnoreCase ) )
                    .Where ( h => h.EndsWith ( ".md" ) )
                    .ToArray ();
            }

            static string RenderHelpCore ( IEnumerable<string> contents, OutputFormat format ) {
                StringBuilder sb = new StringBuilder ();

                if (format == OutputFormat.Html) {
                    sb.Append ( """
                        <!DOCTYPE html>
                        <html>
                            <head>
                                <meta charset="utf-8">
                                <title>Sisk Documentation</title>
                                <style>
                                    html, body { font-family: system-ui, -apple-system, Roboto, "Segoe UI", sans-serif }
                                    pre { background-color: #eee; color: #222; padding: 1em }
                                    table { border-collapse: collapse; width: 100%; }
                                    table td { border: 1px solid #777; padding: .25em .5em; }
                                    table th { text-align: left; }
                                </style>
                            </head>
                            <body>
                                <article>
                        """ );
                }

                foreach (var content in contents) {
                    if (format == OutputFormat.Html) {
                        var parsed = Markdig.Markdown.ToHtml ( content, pipeline: MarkdownPipe );
                        sb.Append ( $"""
                            <section>
                                {parsed}
                            </section>
                            """ );
                    }
                    else {
                        sb.AppendLine ( content );
                        sb.AppendLine ( $"-----------\n" );
                    }
                }

                if (format == OutputFormat.Html) {
                    sb.Append ( $"""
                                </article>
                            </body>
                        </html>
                        """ );
                }

                return sb.ToString ();
            }

            var toc = YamlDeserializer.Deserialize<Toc> ( File.ReadAllText ( yamlToc ) );

            List<string> contents = new List<string> ();
            foreach (var item in toc.Items) {

                if (item.Href is null) {
                    if (format == OutputFormat.Md) {
                        contents.Add ( $"# {item.Name}" );
                    }
                    else if (format == OutputFormat.Html) {
                        contents.Add ( $"<h1 class=\"file-section\"> {item.Name} </h1>" );
                    }
                    continue;
                }

                string? targetFileName = helpFiles.FirstOrDefault ( f => NormalizePath ( f ).EndsWith ( NormalizePath ( item.Href ), StringComparison.OrdinalIgnoreCase ) );
                Debug.Assert ( targetFileName != null );
                string targetFileContents = File.ReadAllText ( targetFileName );

                contents.Add ( targetFileContents );
            }

            string result = RenderHelpCore ( contents, format );

            if (output != null) {

                string? outputPath = Path.GetDirectoryName ( output );
                Debug.Assert ( outputPath != null );

                if (!Directory.Exists ( outputPath )) {
                    Directory.CreateDirectory ( outputPath );
                }

                File.WriteAllText ( output, result );
            }
            else {
                Console.WriteLine ( result );
            }

            return 0;
        }
    }
}
