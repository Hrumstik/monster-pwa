import { useEffect, useRef, useState } from "react";
import { TagsInput } from "react-tag-input-component";
import "@shared/elements/TagInput/TagInput.scss";
import { useClickAway } from "react-use";
import { useUpdatePwaTagsMutation } from "@store/apis/pwaApi";
import { GrFormEdit } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@store/hooks";
import {
  addActiveTag,
  getActiveTags,
  removeActiveTag,
} from "@store/slices/pwaTagsSlice";

const PwaTags = ({ pwaTags, pwaId }: { pwaTags: string[]; pwaId: string }) => {
  const [updatePwaTags] = useUpdatePwaTagsMutation();
  const [showSelectTag, setShowSelectTag] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setValue(pwaTags);
  }, [pwaTags]);

  useClickAway(wrapperRef, () => {
    saveTags();
  });

  useEffect(() => {
    if (showSelectTag) {
      const inputElement = document.querySelector(
        ".rti--input"
      ) as HTMLInputElement;

      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [showSelectTag]);

  const saveTags = () => {
    updatePwaTags({ id: pwaId, pwaTags: value });
    setShowSelectTag(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement = document.querySelector(
      ".rti--input"
    ) as HTMLInputElement;
    setInputValue(inputElement.value);

    if (e.key === "Escape") {
      saveTags();
    }
    if (e.key === "Enter" && inputValue === "") {
      saveTags();
    }
  };

  return !showSelectTag ? (
    <div className="flex justify-center ">
      <TagButton pwaTags={pwaTags} setShowSelectTag={setShowSelectTag} />
    </div>
  ) : (
    <div onClick={(e) => e.stopPropagation()} ref={wrapperRef}>
      <TagsInput
        value={value}
        onChange={(value) => setValue(value)}
        onKeyUp={handleKeyDown}
        classNames={{
          tag: "tagInputCustom",
        }}
      />
    </div>
  );
};

const TagItem = ({ tagName }: { tagName: string }) => {
  const activePwaTags = useAppSelector(getActiveTags);
  const dispatch = useDispatch();
  const isActive = activePwaTags.includes(tagName);
  const handleButtonClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    dispatch(isActive ? removeActiveTag(tagName) : addActiveTag(tagName));
  };
  return (
    <div
      onClick={handleButtonClick}
      className="h-[18px] select-none bg-[#515aca] hover:scale-110 rounded-xl text-xs hover-bg-[#36395a] cursor-pointer px-2 py-1 flex items-center gap-1"
    >
      {tagName}
    </div>
  );
};

const TagButton = ({
  pwaTags,
  setShowSelectTag,
}: {
  pwaTags: string[];
  setShowSelectTag: (value: boolean) => void;
}) => {
  const addTag = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setShowSelectTag(true);
  };

  const editTag = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setShowSelectTag(true);
  };

  return pwaTags.length > 0 ? (
    <div
      className={`min-h-7 py-1 px-2 relative rounded-xl flex gap-2 flex-wrap justify-stretch border border-transparent group-hover:border-solid  group-hover:border-[#515ACA] `}
    >
      <button
        onClick={editTag}
        className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 -mt-2 -mr-2"
      >
        <GrFormEdit className="text-[#00FF11] text-[16px] cursor-pointer" />
      </button>
      {pwaTags.map((tag) => (
        <TagItem key={tag} tagName={tag} />
      ))}
    </div>
  ) : (
    <button
      onClick={(e) => addTag(e)}
      className="border justify-center flex gap-3 h-7 items-center py-1 px-5 border-solid border-[#383B66] group-hover:border-[#515ACA] rounded-[333px]  hover:bg-[#36395A]"
    >
      Добавить тег
    </button>
  );
};

export default PwaTags;
