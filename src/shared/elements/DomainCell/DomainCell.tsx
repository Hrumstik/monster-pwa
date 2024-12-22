import { message, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { MouseEventHandler } from "react";

const handleCopy = (text?: string): void => {
  if (!text) return;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      message.success(`${text} скопирован!`);
    })
    .catch(() => {
      message.error("Не удалось скопировать текст.");
    });
};

const DomainCell = ({ domain }: { domain?: string }) => {
  const handleCopyClick: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();
    handleCopy(domain);
  };

  return (
    <td className="py-3 truncate flex flex-start items-center gap-3">
      <span>{domain ?? "–"}</span>
      {!!domain && (
        <Tooltip title="Копировать">
          <CopyOutlined
            className="cursor-pointer text-gray-500 hover:text-blue-500"
            onClick={handleCopyClick}
          />
        </Tooltip>
      )}
    </td>
  );
};

export default DomainCell;
