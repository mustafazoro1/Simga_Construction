import { type ElementType, type CSSProperties } from "react";
import { useAdmin } from "./AdminContext";

interface EditableTextProps {
  keyName: string;
  defaultText: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  multiline?: boolean;
}

export function EditableText({
  keyName,
  defaultText,
  as: Tag = "span",
  className = "",
  style,
  multiline = false,
}: EditableTextProps) {
  const { editMode, getValue, setValue } = useAdmin();
  const value = getValue(keyName, defaultText);

  if (!editMode) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  const editClassName = [
    className,
    "outline outline-1 outline-dashed outline-primary/60 hover:outline-primary outline-offset-2 cursor-text bg-primary/5 rounded-sm focus:outline-primary focus:outline-2 focus:bg-primary/10 transition-colors",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      key={`${keyName}-edit`}
      className={editClassName}
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-edit-key={keyName}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onPaste={(e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const next = e.currentTarget.textContent ?? "";
        if (next !== value) {
          setValue(keyName, next);
        }
      }}
    >
      {value}
    </Tag>
  );
}
