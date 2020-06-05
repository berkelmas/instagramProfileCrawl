import axios from "axios";

export const getBasicProfileData = async (username, page) => {
  await page.goto(`https://www.instagram.com/${username}/?__a=1`, {
    waitUntil: "networkidle2",
  });
  let jsonStr;
  try {
    jsonStr = await page.evaluate(
      (selector) => document.querySelector(selector).innerText,
      "body > pre"
    );
  } catch {
    return await { isError: true };
  }

  const parsedJson = JSON.parse(jsonStr);
  if (Object.keys(parsedJson).length === 0) {
    return { isError: true };
  }
  const {
    graphql: { user },
  } = parsedJson;
  if (user.is_private) {
    const finalResult = {
      bio: user.biography,
      followedBy: user.edge_followed_by.count,
      following: user.edge_follow.count,
      fullName: user.full_name,
      isPrivate: user.is_private,
      totalMediaCount: user.edge_owner_to_timeline_media.count,
    };
    return finalResult;
  } else {
    const finalResult = {
      bio: user.biography,
      followedBy: user.edge_followed_by.count,
      following: user.edge_follow.count,
      fullName: user.full_name,
      isPrivate: user.is_private,
      is_verified: user.is_verified,
      totalMediaCount: user.edge_owner_to_timeline_media.count,
      lastTwelvePhotos: user.edge_owner_to_timeline_media.edges.map((pic) => ({
        instaAiCaption: pic.node.accessibility_caption,
        commentsDisabled: pic.node.comments_disabled,
        likedBy: pic.node.edge_liked_by.count,
        mediaCaption: pic.node.edge_media_to_caption.edges.map((item) => ({
          text: item.node.text,
        })),
        commentCount: pic.node.edge_media_to_comment.count,
        takenAtTimestamp: pic.node.taken_at_timestamp,
      })),
    };
    return finalResult;
  }
};
