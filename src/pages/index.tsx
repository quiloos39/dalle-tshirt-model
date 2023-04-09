import { SearchBar } from "@/components/SearchBar";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Homepage = () => {
  const [search, setSearch] = useState("");
  const searchBarRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function onSubmit(search: string) {
    const base64Encoded = Buffer.from(search).toString("base64");
    router.push(`/search/${base64Encoded}`);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (searchBarRef.current) {
        if (e.code === "Enter") {
          e.preventDefault();
          if (document.activeElement === searchBarRef.current) {
            if (search.length > 0) {
              onSubmit(search);
            } else {
              searchBarRef.current.blur();
            }
          } else {
            searchBarRef.current.focus();
          }
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [search, router]);

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <div className="w-full max-w-[800px] ">
        <p className="text-gray-600 mb-2">Start with a detailed description</p>
        <SearchBar search={search} onChange={(search) => setSearch(search)} ref={searchBarRef} onClick={() => onSubmit(search)} />
      </div>
    </div>
  );
};

export default Homepage;
