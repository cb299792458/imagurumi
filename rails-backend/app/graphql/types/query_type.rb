module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Users field
    field :users, [Types::UserType], null: false, description: "Fetches a list of users."

    def users
      User.all
    end

    # User field by ID
    field :user, Types::UserType, null: true, description: "Fetches a user by ID" do
      argument :id, ID, required: true, description: "ID of the user."
    end

    def user(id:)
      User.find(id)
    end

    field :patterns, [Types::PatternType], null: false, description: "Fetches a list of patterns."
    def patterns
      Pattern.all
    end

    field :pattern, Types::PatternType, null: true, description: "Fetches a pattern by ID" do
      argument :id, ID, required: true, description: "ID of the pattern."
    end
    def pattern(id:)
      begin
        Pattern.find(id)
      rescue ActiveRecord::RecordNotFound
        raise GraphQL::ExecutionError, "Pattern not found"
      end
    end
  end
end
