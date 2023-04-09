import { SearchBar } from "@/components/SearchBar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

const SearchPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const searchBarRef = useRef<HTMLInputElement>(null);

  const {
    isLoading,
    mutate,
    data: url,
  } = useMutation<string, Error, { prompt: string }>([search], async ({ prompt }) => {
    const { data: buffer } = await axios.post(
      "/api/generate",
      {
        prompt,
      },
      {
        responseType: "arraybuffer",
      }
    );
    const blob = new Blob([buffer], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    return url;
  });

  const Renderer = useMemo(
    () =>
      dynamic(() => import("../../components/Renderer").then((component) => component.Renderer), {
        ssr: false,
      }),
    [url]
  );

  useEffect(() => {
    if (router.isReady) {
      const search = router.query.search as string;
      const decodedSearch = Buffer.from(search, "base64").toString("ascii");
      setSearch(decodedSearch);
      mutate({ prompt: decodedSearch });
    }
  }, [router.isReady, router.query, mutate]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (searchBarRef.current) {
        if (e.code === "Enter") {
          e.preventDefault();
          if (document.activeElement === searchBarRef.current) {
            if (search.length > 0) {
              mutate({ prompt: search });
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
  }, [search, router, mutate]);

  return (
    <div className="relative h-screen flex items-center justify-center flex-col">
      {isLoading ? <div className="bg-gray-500 w-[256px] h-[256px] animate-pulse" /> : <Renderer texture={url!} />}

      <motion.div
        className="absolute left-auto right-auto w-full max-w-[800px]"
        initial={{
          bottom: 100,
          opacity: 0.2,
        }}
        animate={{
          bottom: 50,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <SearchBar
          search={search}
          onChange={(search) => setSearch(search)}
          loading={isLoading}
          onClick={() => mutate({ prompt: search })}
          ref={searchBarRef}
        />
      </motion.div>
    </div>
  );
};

export default SearchPage;
