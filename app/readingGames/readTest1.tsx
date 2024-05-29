import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { handleGame } from '../redux/game/gameSlice';
import { AppDispatch, RootState } from '../redux/store';

const ReadTest1 = ({ lessonNumber }: { lessonNumber: number }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { games, loading, error } = useSelector((state: RootState) => state.game);

    useEffect(() => {
        const fetchGame = async () => {
            const resultAction = await dispatch(handleGame(lessonNumber));
            if (handleGame.fulfilled.match(resultAction)) {
                console.log("Game fetched successfully");
            } else if (handleGame.rejected.match(resultAction)) {
                console.log("Game fetch failed");
            }
        };

        fetchGame();
    }, [dispatch, lessonNumber]);

    // Filter the game data based on the conditions
    const filteredGame = games.find((game) =>
        game.gameType === "Question and Answer"
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>Error: {error}</Text>
            ) : filteredGame ? (
                <Text>{filteredGame.gameType}</Text>
            ) : (
                <Text>No matching game found</Text>
            )}
        </View>
    );
}

export default ReadTest1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

