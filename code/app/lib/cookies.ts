import Cookies from "js-cookie"; 

export function saveRatingToCookies(quizId: string, value: number){
  // Get existing ratings from cookie
  const existing = Cookies.get("quizRatings");
  let data = existing ? JSON.parse(existing) : { ratings: {} };

  // Update rating for this quiz
  data.ratings[quizId] = value; 

  // Save back to cookie
  Cookies.set("quizRatings", JSON.stringify(data), { expires: 30 });
}

export function deleteRatingFromCookies(quizId: string) {
  const existing = Cookies.get("quizRatings");
  if (!existing) return;

  const data = JSON.parse(existing);
  if (data.ratings && data.ratings[quizId] !== undefined) {
    delete data.ratings[quizId];
    Cookies.set("quizRatings", JSON.stringify(data), { expires: 30 });
  }
}

export function readRatingFromCookies(quizId: string){
  const existing = Cookies.get("quizRatings");
  if (existing) {
    try {
      const data = JSON.parse(existing);
      if (data.ratings && data.ratings[quizId] !== undefined) {
        return data.ratings[quizId];
      }
      else {
        return null;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}