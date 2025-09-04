require "rails_helper"

RSpec.describe "Api::V1::SvgController", type: :request do
  describe "POST /api/v1/convert_to_pdf" do
    context "with valid svg file" do
      let(:file) { fixture_file_upload('example.svg', "image/svg+xml") }

      it "returns 200 and JSON with pdf_url" do
        post "/api/v1/convert_to_pdf", params: { file: file }

        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:id]).to be_present
        expect(json[:pdf_url]).to be_present
      end
    end

    context "with missing file" do
      it "returns 422 and error message" do
        post "/api/v1/convert_to_pdf", params: {}

        expect(response).to have_http_status(:unprocessable_content)

        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:error]).to include("Provide .svg file")
      end
    end

    context "with invalid file type" do
      let(:file) { fixture_file_upload("example.txt", "text/plain") }

      it "returns 422 and error message" do
        post "/api/v1/convert_to_pdf", params: { file: file }

        expect(response).to have_http_status(:unprocessable_content)

        json = JSON.parse(response.body, symbolize_names: true)
        expect(json[:error]).to include("Provide .svg file")
      end
    end
  end
end
