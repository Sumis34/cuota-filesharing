import axios from "axios";
import { FormEvent, useState } from "react";
import { trpc } from "../../utils/trpc";
import Button from "../UI/Button";

const uploadFile = async (file: File, url: string) => {
  const res = await axios.put(url, {
    body: file,
  });
  console.log(res);
};

export default function Uploader() {
  const [file, setFile] = useState<File | undefined | null>(null);

  const getUploadUrlMutation = trpc.useMutation(["upload.request"], {
    onSuccess: (data) => {
      const { url } = data;
      if (file) uploadFile(file, url);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file)
      getUploadUrlMutation.mutate({
        name: file?.name,
      });
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="backdrop-blur-xl shadow-white shadow-inner bg-white/50 flex rounded-3xl w-80 p-5 flex-col"
    >
      <h2>Select files</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      <Button variant="primary" className="mt-3">
        Get Link
      </Button>
    </form>
  );
}
