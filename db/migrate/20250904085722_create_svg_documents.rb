class CreateSvgDocuments < ActiveRecord::Migration[8.0]
  def change
    create_table :svg_documents do |t|
      t.timestamps
    end
  end
end
