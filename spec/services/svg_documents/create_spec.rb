require 'rails_helper'

RSpec.describe SvgDocuments::Create do
  let(:service) { described_class.new(uploaded_file) }

  describe "#call" do
    before do
      service.call
    end

    context "with valid svg file" do
      let(:uploaded_file) do
        fixture_file_upload("example.svg", "image/svg+xml")
      end

      it "creates SvgDocument with attached svg and pdf" do
        expect(service).to be_success
        expect(service.errors).to be_empty
        expect(service.resource).to be_a(SvgDocument)

        expect(service.resource.svg).to be_attached
        expect(service.resource.pdf).to be_attached
      end
    end

    context "when file is not provided" do
      let(:uploaded_file) { nil }

      it "returns error" do
        expect(service).not_to be_success
        expect(service.errors).to include("Provide .svg file")
      end
    end
  end
end
