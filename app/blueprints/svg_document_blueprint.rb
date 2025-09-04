class SvgDocumentBlueprint < Blueprinter::Base
  identifier :id
  fields :created_at, :updated_at
  field :pdf_url do |document|
    document.pdf.url
  end
  field :pdf_name do |document|
    document.pdf.filename.to_s
  end
end
