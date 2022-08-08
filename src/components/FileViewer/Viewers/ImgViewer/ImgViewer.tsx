import { PreviewContext } from "../../Previewer/PreviewContext";

export default function ImgViewer({ path }: { path: string }) {
  return (
    <PreviewContext.Consumer>
      {({ img }) => (
        <img src={path} className={img.className} style={img.styles} />
      )}
    </PreviewContext.Consumer>
  );
}
