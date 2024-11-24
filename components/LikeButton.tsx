import { ViewStyle, Pressable } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeCharacter } from "@/lib/api";

interface LikeButtonProps {
  id: string;
  style?: ViewStyle;
  isLiked: boolean
}

export default function LikeButton({ style, id, isLiked }: LikeButtonProps) {
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleLikeCharacter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likedCharactersIds"] });
    },
  });


  return (
    <Pressable onPress={() => toggleLikeMutation.mutate()} style={style}>
      <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color="red" />
    </Pressable>
  );
}
