# app/graphql/types/mutation_type.rb
module Types
  class MutationType < Types::BaseObject
    field :create_pattern, Types::PatternType, null: false, description: "Create a new pattern" do
      argument :name, String, required: true, description: "Name of the pattern"
      argument :description, String, required: true, description: "Description of the pattern"
      argument :user_id, ID, required: true, description: "ID of the user who created the pattern"
      argument :text, String, required: true, description: "Text of the pattern"
    end

    def create_pattern(name:, description:, user_id:, text:)
      user = User.find(user_id)
      pattern = Pattern.new(name: name, description: description, user: user, text: text)

      if pattern.save
        pattern
      else
        raise GraphQL::ExecutionError, pattern.errors.full_messages.join(", ")
      end
    end

    field :update_pattern, Types::PatternType, null: false, description: "Update an existing pattern" do
      argument :id, ID, required: true, description: "ID of the pattern to update"
      argument :name, String, required: false, description: "New name of the pattern"
      argument :description, String, required: false, description: "New description of the pattern"
      argument :text, String, required: false, description: "New text of the pattern"
    end

    def update_pattern(id:, name: nil, description: nil, text: nil)
      pattern = Pattern.find(id)

      if name
        pattern.name = name
      end

      if description
        pattern.description = description
      end

      if text
        pattern.text = text
      end

      if pattern.save
        pattern
      else
        raise GraphQL::ExecutionError, pattern.errors.full_messages.join(", ")
      end
    end

    field :delete_pattern, Boolean, null: false, description: "Delete a pattern" do
      argument :id, ID, required: true, description: "ID of the pattern to delete"
    end
    
    def delete_pattern(id:)
      pattern = Pattern.find(id)

      if pattern.destroy
        true
      else
        raise GraphQL::ExecutionError, pattern.errors.full_messages.join(", ")
      end
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError, "Pattern not found"
    end

  end
end
