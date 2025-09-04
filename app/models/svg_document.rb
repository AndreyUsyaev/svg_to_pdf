class SvgDocument < ApplicationRecord
  has_one_attached :svg
  has_one_attached :pdf

  validates :svg, content_type: [ "image/svg+xml" ]
  validates :pdf, content_type: [ "application/pdf" ]
end
