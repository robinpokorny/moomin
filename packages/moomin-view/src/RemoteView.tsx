import React from "react";
import { deserialize } from "./deserialize";

interface RemoteViewProps {
  src: string
  extraProps?: object
  components?: object
}

interface useSerializedViewRes {
  status: viewStatus;
  serializedRemote: any;
}

type viewStatus = "error" | "loading" | "success";

function useSerializedView(src: string): useSerializedViewRes {
  const [status, setStatus] = React.useState<viewStatus>("loading");
  const [serializedRemote, setSerializedRemote] = React.useState<any>(null);

  // on mount, fetch the data
  React.useEffect(() => {
    (async () => {
      try {
        console.log(src);
        const remote = await fetch(src);
        setSerializedRemote(await remote.json());
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    })();
  }, []);

  return {
    status,
    serializedRemote,
  };
}

function RemoteView(props: RemoteViewProps) {
  const { src, components } = props;
  const { status, serializedRemote } = useSerializedView(src);

  // todo: add error, loading components
  if (status !== "success") return null;

  return deserialize(serializedRemote, components);
}

export default RemoteView;
