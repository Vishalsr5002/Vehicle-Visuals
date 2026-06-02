import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { reverseSlugMap } from "../utils/slugMap";

export default function SlugRouter({
  setSelectedOption
}) {
  const { slug } = useParams();

  useEffect(() => {
    const option =
      reverseSlugMap[slug];

    if (option) {
      setSelectedOption(option);
    }
  }, [slug]);

  return null;
}