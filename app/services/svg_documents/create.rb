module SvgDocuments
  class Create
    DEFAULT_FILENAME = "converted.pdf"

    attr_reader :uploaded_file, :ai_response

    def initialize(uploaded_file, ai_response = "")
      @uploaded_file = uploaded_file
      @ai_response = ai_response
    end

    def call
      if uploaded_file.blank? || uploaded_file.content_type != "image/svg+xml"
        errors << "Provide .svg file"
        return
      end

      ai_svg = ai_svg_valid? ? ai_response[/<begin>(.*?)<end>/m, 1]&.gsub(/[\r\n]/, "") : nil

      pdf = ConvertToPdf.new(ai_svg || uploaded_file).call
      io = StringIO.new(pdf.render)
      resource.svg.attach(uploaded_file)
      resource.pdf.attach(io: io, content_type: "application/pdf", filename: DEFAULT_FILENAME)
      unless resource.save
        errors << resource.errors.full_messages.to_sentence
      end
    rescue StandardError => e
      errors << e.message
    end

    def success?
      errors.blank?
    end

    def errors
      @errors ||= []
    end

    def resource
      @resource ||= SvgDocument.new
    end

    private

    def ai_svg_valid?
      ai_response.present? &&
        ai_response.include?("<svg ") &&
        ai_response.include?("xmlns=\"http://www.w3.org/2000/svg\"")
    end
  end
end
