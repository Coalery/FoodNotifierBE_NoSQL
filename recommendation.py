from scipy.sparse.linalg import svds
import pandas as pd
import numpy as np
import warnings

warnings.filterwarnings("ignore")

def recommend_recipes(df_svd_preds, user_id, ori_recipes_df, ori_ratings_df, num_recommendations = 5):
    user_row_number = user_id - 1

    sorted_user_predictions = df_svd_preds.iloc[user_row_number].sort_values(ascending=False)
    user_data = ori_ratings_df[ori_ratings_df.uid == user_id]
    user_history = user_data.merge(ori_recipes_df, on = 'rid').sort_values(['rating'], ascending=False)

    recommendations = ori_recipes_df[~ori_recipes_df['rid'].isin(user_history['rid'])]
    recommendations = recommendations.merge(pd.DataFrame(sorted_user_predictions).reset_index(), on = 'rid')
    recommendations = recommendations.rename(columns = {user_row_number: 'Predictions'}).sort_values('Predictions', ascending = False).iloc[:num_recommendations, :]

    return user_history, recommendations

df_recipe = pd.read_csv('/content/drive/My Drive/Learn/recipe.csv') # Recipe Data Load
df_ratings = pd.read_csv('/content/drive/My Drive/Learn/ratings.csv', sep='\t') # Ratings Data Load

df_user_recipe_ratings = df_ratings.pivot(
    index='uid',
    columns='rid',
    values='rating'
).fillna(0) # Make User - Recipe Pivot Table

matrix = df_user_recipe_ratings.to_numpy() # Convert Pivot Table to Numpy Matrix
user_ratings_mean = np.mean(matrix, axis = 1) # User's Average Rating
matrix_user_mean = matrix - user_ratings_mean.reshape(-1, 1) # (User-Recipe Matrix) - (Average Rating)

U, sigma, Vt = svds(matrix_user_mean, k = 1)
sigma = np.diag(sigma)

svd_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.reshape(-1, 1)
df_svd_preds = pd.DataFrame(svd_user_predicted_ratings, columns = df_user_recipe_ratings.columns)

already_rated, predictions = recommend_recipes(df_svd_preds, 2, df_recipe, df_ratings)

print(predictions.iloc[0]['rid'])
