import { Rating } from "@/services/ratingService";
import { Restaurant } from "@/services/restaurantService";
import { FaStar } from "react-icons/fa";

export const RatingsTabComponent = ({
  reviews,
  user,
  userOrders,
  restaurant,
  handleOpenRatingModal,
  isRatingModalOpen,
  rating,
  setRating,
  comment,
  setComment,
  submitLoading,
  setIsRatingModalOpen,
  handleSubmitRating,
  formatDate,
  renderStars,
}: {
  reviews: Rating[];
  user: { id?: string; nome?: string; tipo?: string } | null;
  userOrders: string[];
  restaurant: Restaurant;
  handleOpenRatingModal: () => void;
  isRatingModalOpen: boolean;
  rating: number;
  setRating: (value: number) => void;
  comment: string;
  setComment: (value: string) => void;
  submitLoading: boolean;
  setIsRatingModalOpen: (value: boolean) => void;
  handleSubmitRating: () => void;
  formatDate: (date: string) => string;
  renderStars: (rating: number) => React.ReactNode[];
}) => (
  <div className="mt-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Avaliações</h2>
      {user && userOrders.length > 0 && user.tipo !== "restaurante" && (
        <button
          onClick={handleOpenRatingModal}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Adicionar Avaliação
        </button>
      )}
    </div>

    {reviews.length === 0 ? (
      <div className="bg-white p-4 rounded-lg shadow-md text-center py-8">
        <p className="text-gray-500 mb-4">
          Seja o primeiro a fazer uma avaliação!
        </p>
        {user ? (
          user.tipo !== "restaurante" ? (
            userOrders.length > 0 ? (
              <button
                onClick={handleOpenRatingModal}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Avaliar Restaurante
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Faça um pedido neste restaurante para poder avaliá-lo
              </p>
            )
          ) : (
            <p className="text-gray-500 text-sm">
              Restaurantes não podem avaliar outros restaurantes
            </p>
          )
        ) : (
          <p className="text-gray-500 text-sm">
            Faça login para avaliar este restaurante
          </p>
        )}
      </div>
    ) : (
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <h3 className="font-medium">
                {user && user.id === review.userId ? user.nome : "Cliente"}
              </h3>
              <span className="text-gray-500 text-xs">
                {formatDate(review.createdAt)}
              </span>
            </div>

            <div className="flex mt-1 mb-2">{renderStars(review.nota)}</div>

            {review.comentario && (
              <p className="text-gray-700 text-sm mt-2">{review.comentario}</p>
            )}
          </div>
        ))}
      </div>
    )}

    {isRatingModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Avaliar {restaurant.nome}</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Usuário</label>
            <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700">
              {user?.nome || "Usuário"}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nota</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="text-2xl focus:outline-none"
                >
                  <FaStar
                    className={
                      value <= rating ? "text-yellow-500" : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Comentário (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="Conte sua experiência com este restaurante..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsRatingModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitRating}
              disabled={submitLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:bg-red-300"
            >
              {submitLoading ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
