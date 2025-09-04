module SvgDocuments
  class Create
    DEFAULT_FILENAME = "converted.pdf"

    attr_reader :uploaded_file

    def initialize(uploaded_file)
      @uploaded_file = uploaded_file
    end

    def call
      if uploaded_file.blank? || uploaded_file.content_type != "image/svg+xml"
        errors << "Provide .svg file"
        return
      end

      pdf = ConvertToPdf.new(uploaded_file).call
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
  end
end
