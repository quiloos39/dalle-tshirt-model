import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { forwardRef, useMemo } from "react";

type SearchBarProps = {
  search: string;
  onChange: (search: string) => void;
  loading?: boolean;
  onClick?: () => void;
};

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ search, onChange, loading = false, onClick }, ref) => {
  const isSearchAble = useMemo(() => {
    return search.length > 0;
  }, [search]);

  return (
    <div className="mx-auto flex bg-white shadow-lg rounded overflow-hidden">
      <input
        //
        className="bg-transparent w-full outline-none p-3"
        onChange={(e) => onChange(e.target.value)}
        value={search}
        ref={ref}
        disabled={loading}
      />
      <motion.button
        className="font-bold py-3 w-[100px] overflow-hidden"
        onClick={onClick}
        disabled={!isSearchAble || loading}
        initial={{
          backgroundColor: "#fff",
          color: "rgb(156 163 175)",
        }}
        animate={{
          backgroundColor: isSearchAble ? "#000" : "#fff",
          color: isSearchAble ? "#fff" : "rgb(156 163 175)",
        }}
      >
        {loading ? (
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 1,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <FontAwesomeIcon icon={faSpinner} />
          </motion.div>
        ) : (
          "Generate"
        )}
      </motion.button>
    </div>
  );
});

SearchBar.displayName = "SearchBar";
