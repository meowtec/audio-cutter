import clsx from 'clsx';
import React, { PropsWithChildren, useState } from 'react';

interface FilePickerProps {
  className?: string;
  onPick(file?: File): void;
}

export default function FilePicker({
  onPick,
  className,
  children,
}: PropsWithChildren<FilePickerProps>) {
  const [inputKey, setInputKey] = useState(0);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onPick(e.currentTarget?.files?.[0]);
    setInputKey(inputKey + 1);
  };

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={clsx('file', className)}>
      { children }
      <input type="file" key={inputKey} onChange={handleChange} />
    </label>
  );
}
