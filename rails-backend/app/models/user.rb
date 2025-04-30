class User < ApplicationRecord
  has_many :patterns, dependent: :destroy
end
