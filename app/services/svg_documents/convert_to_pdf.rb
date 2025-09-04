module SvgDocuments
  class ConvertToPdf
    WATERMARK = "John Doe".freeze

    attr_reader :svg

    def initialize(svg)
      @svg = svg
    end

    def call
      svg_file = svg.tempfile
      svg_content = File.read(svg_file)

      Prawn::Document.new(page_size: "A4") do |pdf|
        margin = 28.35

        pdf.stroke_color "000000"
        pdf.stroke do
          pdf.rectangle(
            [ pdf.bounds.left + margin, pdf.bounds.top - margin ],
            pdf.bounds.width - 2 * margin,
            pdf.bounds.height - 2 * margin
          )
        end

        pdf.svg svg_content,
                at: [ pdf.bounds.left + margin, pdf.bounds.top - margin ],
                width: pdf.bounds.width - 2 * margin,
                height: pdf.bounds.height - 2 * margin

        pdf.fill_color "cccccc"
        pdf.font_size 50
        pdf.draw_text WATERMARK, at: [ 100, pdf.bounds.height / 2 ], rotate: 45
      end
    end
  end
end
