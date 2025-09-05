require 'openapi_helper'

RSpec.describe 'api/v1/svg', type: :request do
  path '/api/v1/convert_to_pdf' do
    let(:request_params) do
      {
        'file' => file
      }
    end

    post('convert_to_pdf svg') do
      tags 'SVG'
      consumes 'multipart/form-data'
      produces 'application/json'
      parameter name: 'file',
                in: :formData,
                required: true,
                schema: {
                  type: :string,
                  format: :binary
                },
                description: 'SVG file to convert'

      response(200, 'successful') do
        let(:file) { fixture_file_upload('example.svg', 'image/svg+xml') }
        run_test!
      end

      response(422, 'unprocessable_content') do
        let(:file) { nil }
        run_test!
      end
    end
  end
end
