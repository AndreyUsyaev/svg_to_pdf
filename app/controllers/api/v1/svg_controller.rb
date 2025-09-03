# frozen_string_literal: true

module Api
  module V1
    class SvgController < ActionController::API
      include ActionController::RequestForgeryProtection

      def convert_to_pdf
        p params
        head :unprocessable_content
      end

      private
    end
  end
end
