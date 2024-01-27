import pandas as pd
import numpy as np
import matplotlib as plt
from player import Player
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.static import players
import os
import time
import warnings
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense
from keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import MinMaxScaler


# use each year to create csvs of all player data
def generate_player_data(year):
    # find all players
    all_players = players.get_active_players()
    print(f"Total number of players: {len(all_players)}")
    counter = 0
    max_retries = 30  # Adjust the maximum number of retries as needed

    for player in all_players:
        id = player["id"]
        csv_filename = player["full_name"].replace(" ", "_") + ".csv"

        os.makedirs("nba_datasets/" + year, exist_ok=True)
        folder_path = "nba_datasets/" + year
        # Define the CSV file path within the "2023" folder
        csv_file_path = os.path.join(folder_path, csv_filename)

        # Check if the file already exists
        if os.path.exists(csv_file_path):
            print(f"File '{csv_filename}' already exists. Skipping. Counter: {counter}")
            counter += 1
            continue
        else:
            retries = 0
            while retries < max_retries:
                try:
                    career = playercareerstats.PlayerCareerStats(player_id=id)
                    career_data = career.get_data_frames()[0]
                    datatable = pd.DataFrame(career_data)
                    datatable.to_csv(csv_file_path, index=False)
                    counter += 1
                    print(f"File '{csv_filename}' saved. Counter: {counter}")
                    break  # Break out of the retry loop if successful
                except Exception as e:
                    print("Error fetching data for player " + player["full_name"] + ". Retry " + str(retries+1) + "/" + str(max_retries) + ". Error: " + e)
                    retries += 1
                    time.sleep(10)  # Add a delay before retrying

            if retries == max_retries:
                print(f"Max retries reached for player {id}. Skipping.")

    if len(all_players) == counter:
        print("Completed all players!")
        
def combine_rows(df):
    # Identify rows with duplicate SEASON_ID
    duplicate_seasons = df[df.duplicated(subset=['SEASON_ID'], keep=False)]

    # Filter the DataFrame based on conditions
    df_filtered = pd.concat([
        df[(df['SEASON_ID'].isin(duplicate_seasons['SEASON_ID'])) & (df['TEAM_ABBREVIATION'] == 'TOT')],
        df[~df['SEASON_ID'].isin(duplicate_seasons['SEASON_ID'])]
    ])

    df_filtered = df_filtered.reset_index(drop=True)

    return df_filtered


def read_csv_files_in_folder(year):
    """
    Reads all CSV files in a folder and returns a list of DataFrames.

    Parameters:
    - folder_path (str): The path to the folder containing CSV files.

    Returns:
    - List of pandas DataFrames.
    """

    os.makedirs("nba_datasets/" + year, exist_ok=True)
    folder_path = "nba_datasets/" + year

    # List all files in the folder
    files = os.listdir(folder_path)

    # Initialize an empty list to store DataFrames
    dataframes_list = []

    # Loop through each file in the folder
    for file in files:
        # Check if the file is a CSV file
        if file.endswith(".csv"):
            # Construct the full path to the CSV file
            file_path = os.path.join(folder_path, file)

            # Read the CSV file into a DataFrame
            df_first = pd.read_csv(file_path)
            df_first = df_first.drop('FG_PCT', axis=1)
            df_first = df_first.drop('FG3_PCT', axis=1)
            df_first = df_first.drop('FT_PCT', axis=1)
            df = combine_rows(df_first)

            # Append the DataFrame to the list
            dataframes_list.append(df)

    return dataframes_list

def list_to_df(df_list):
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        # Display the resulting DataFrame
        return pd.concat(df_list, ignore_index=True)




# Generate new player data
# generate_player_data("2024")
        
df_list = read_csv_files_in_folder("2024")

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    # Display the resulting DataFrame
    print(df_list[0])



df = list_to_df(df_list)

# Feature scaling using Min-Max scaling
scaler = MinMaxScaler()
df_scaled = pd.DataFrame(scaler.fit_transform(df), columns=df.columns)

# Function to create sequences and labels
def create_sequences_and_labels(data, sequence_length):
    sequences, labels = [], []
    for i in range(len(data) - sequence_length + 1):
        seq = data.iloc[i:i+sequence_length].values
        label = data.iloc[i+sequence_length-1].values
        sequences.append(seq)
        labels.append(label)
    return np.array(sequences), np.array(labels)

# Define the maximum sequence length
max_sequence_length = 5  # Adjust as needed

# Create sequences and labels
X, y = create_sequences_and_labels(df_scaled, max_sequence_length)

# Split the data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# Build the model
model = Sequential()
model.add(LSTM(units=50, input_shape=(X_train.shape[1], X_train.shape[2])))
model.add(Dense(units=df.shape[1]))  # Output layer with the same number of features as input

# Compile the model
model.compile(optimizer='adam', loss='mse')  # Adjust the loss function based on your task

# Train the model
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_val, y_val))

print("here")
# Now you can use the trained model to make predictions on new data
# For example, if you have a new player's stats for the last 3 seasons:
new_data = np.array([df_scaled.iloc[-max_sequence_length:].values])
predicted_stats = model.predict(new_data)

# Inverse transform the predicted stats to get them in the original scale
predicted_stats_original_scale = scaler.inverse_transform(predicted_stats)







# # Sort dataframe by PLAYER_ID and SEASON_ID
# df.sort_values(by=['PLAYER_ID', 'SEASON_ID'], inplace=True)

# # Add a column for the next year's stats
# df['NEXT_PTS'] = df.groupby('PLAYER_ID')['PTS'].shift(-1)

# # Drop rows where NEXT_PTS is NaN (last season for each player)
# df = df.dropna(subset=['NEXT_PTS'])

# print(df.head(22))

# # Select relevant columns for training
# columns_to_use = ['PLAYER_ID', 'SEASON_ID', 'PLAYER_AGE', 'GP', 'GS', 'MIN', 'FGM', 'FGA', 'FG3M', 'FG3A', 'FTM', 'FTA',
#                   'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS', 'NEXT_PTS']
# # columns_to_use = ['PLAYER_AGE', 'GP', 'GS', 'MIN', 'FGM', 'FGA', 'FG3M', 'FG3A', 'FTM', 'FTA',
# #                   'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS', 'NEXT_PTS']

# # Standardize the features
# scaler = StandardScaler()
# df[columns_to_use[2:]] = scaler.fit_transform(df[columns_to_use[2:]])

# # Create sequences for training
# X_seq, y_seq = [], []

# for player_id, player_data in df.groupby('PLAYER_ID'):
#     player_data = player_data[columns_to_use]
    
#     player_X_seq, player_y_seq = [], []
    
#     for i in range(len(player_data) - 1):
#         player_X_seq.append(player_data.iloc[:i + 1].values)
#         player_y_seq.append(player_data.iloc[i + 1]['NEXT_PTS'])




#     X_seq.append(player_X_seq)
#     y_seq.extend(player_y_seq)


# all_players = players.get_active_players()
# print(f"Total number of players: {len(all_players)}")
# print(len(X_seq))

# max_seasons = df.groupby('PLAYER_ID')['SEASON_ID'].nunique().max()
# print(max_seasons)
# print(len(columns_to_use))
# # Pad sequences to a fixed length (adjust maxlen as needed)
# X_seq_padded = pad_sequences(X_seq, dtype='float32', padding='post', truncating='post', maxlen=max_seasons)


# print(X_seq_padded.shape)
# # Pad sequences to a fixed length (adjust maxlen as needed)
# y_seq = np.array(y_seq)


# print(X_seq_padded[0])

# # Split the data into training and testing sets
# X_train, X_test, y_train, y_test = train_test_split(X_seq_padded, y_seq, test_size=0.2, random_state=42)

# # Build the LSTM model
# model = Sequential()
# model.add(LSTM(50, activation='relu', input_shape=(None, X_train.shape[2])))
# model.add(Dense(1))
# model.compile(optimizer='adam', loss='mse')
# print('fitting')
# # Train the model
# model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test), verbose=2)

# # Make predictions for a specific player's next year's PTS
# player_id_to_predict = 2544  # Replace with the desired PLAYER_ID
# player_data_to_predict = df[df['PLAYER_ID'] == player_id_to_predict][columns_to_use].values
# player_data_to_predict[:, 2:] = scaler.transform(player_data_to_predict[:, 2:])
# player_data_to_predict = player_data_to_predict.reshape((1, player_data_to_predict.shape[0], player_data_to_predict.shape[1])).astype('float32')  # Modify this line

# predicted_pts = model.predict(player_data_to_predict)

# print(f"Predicted PTS for the next season: {predicted_pts[0][0]}")



# # Define features and target
# # features = ['Feature1', 'Feature2', '...']  # Replace with actual feature names
# # target = 'PTS'

# # # Extract features and target
# # X = df[features].values
# # y = df[target].values

# # # Normalize the features
# # scaler = MinMaxScaler()
# # X_scaled = scaler.fit_transform(X)

# # # Create sequences of past stats for each player
# # sequences = []
# # next_season_pts = []

# # unique_players = df['Player'].unique()

# # for player in unique_players:
# #     player_data = df[df['Player'] == player]
# #     player_features = player_data[features].values
# #     player_features_scaled = scaler.transform(player_features)

# #     for i in range(1, len(player_data)):
# #         sequence = player_features_scaled[:i]
# #         target_pts = player_data.iloc[i][target]
# #         sequences.append(sequence)
# #         next_season_pts.append(target_pts)

# # X_seq = np.array(sequences)
# # y_seq = np.array(next_season_pts)

# # # Split the data into training and testing sets
# # X_train, X_test, y_train, y_test = train_test_split(X_seq, y_seq, test_size=0.2, random_state=42)

# # # Build the RNN model using TensorFlow
# # model = tf.keras.Sequential([
# #     tf.keras.layers.LSTM(50, activation='relu', input_shape=(None, X_train.shape[2])),
# #     tf.keras.layers.Dense(1)
# # ])

# # model.compile(optimizer='adam', loss='mse')  # Mean Squared Error loss for regression

# # # Train the model
# # model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test))

# # # Now you can use the trained model to make predictions on new data for future seasons



# # # Nikola Jokić
# # # career = playercareerstats.PlayerCareerStats(player_id='203999') 

# # # # pandas data frames (optional: pip install pandas)
# # # data = career.get_data_frames()[0]

# # # datatable = pd.DataFrame(data)

# # print(datatable)



