"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useClient from "../../_store/useClient";

interface AddClientProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

const AddClient = ({ open, onOpenChange, onSubmit }: AddClientProps) => {
  const [name, setName] = useState("");
  const [codeName, setCodeName] = useState("");

  const { fetchClients, addClient } = useClient();

  const handleSubmit = async ({
    name,
    code_name,
    onClose,
    refetch,
  }: {
    name: string;
    code_name?: string;
    onClose?: () => void;
    refetch?: () => void;
  }) => {
    try {
      const data = await addClient({ name, code_name });

      refetch?.();
      onClose?.();

      return data;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new client.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({
              name,
              code_name: codeName,
              refetch: fetchClients,
              onClose: () => onOpenChange(false),
            });
          }}
        >
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Enter code name"
              value={codeName}
              onChange={(e) => setCodeName(e.target.value)}
              required
            />
            <Input
              placeholder="Enter client name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={() => onSubmit?.({ name, codeName })}>
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClient;
