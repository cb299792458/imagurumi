class CreatePattern < ActiveRecord::Migration[8.0]
  def change
    create_table :patterns do |t|
      t.string :name
      t.string :description
      t.string :text
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
