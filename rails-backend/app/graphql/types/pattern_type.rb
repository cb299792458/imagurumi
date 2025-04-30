module Types
  class PatternType < BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: true
    field :user, UserType, null: false
    field :text, String, null: false  # Fixed this line
  end
end
