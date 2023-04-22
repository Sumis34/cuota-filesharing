import { FormEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../UI/alert-dialog";
import Button from "../UI/Button";

export function NoKeyAlert({
  open,
  onAction,
}: {
  open: boolean;
  onAction: (s: string) => void;
}) {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAction(key);
  };

  const [key, setKey] = useState("");

  return (
    <AlertDialog open>
      <AlertDialogContent>
        <form onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter your Key</AlertDialogTitle>
            <AlertDialogDescription>
              You habe opened an encrypted share without a key present in the
              url. This can happen if you come from "My Uploads" as we don't
              safe your key's on the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="text"
            required
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogAction type="submit">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
