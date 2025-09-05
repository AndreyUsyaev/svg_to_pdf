# frozen_string_literal: true

module Api
  module V1
    class SvgController < ActionController::API
      include ActiveStorage::SetCurrent
      def convert_to_pdf
        service = SvgDocuments::Create.new(params[:file], params[:ai_response])
        service.call
        if service.success?
          render json: SvgDocumentBlueprint.render(service.resource)
        else
          render json: { error: service.errors }, status: :unprocessable_content
        end
      end
    end
  end
end
