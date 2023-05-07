import {FC} from "react";
import {Props} from "react-flagkit";
import {AlbumPreviewType} from "../utils/AlbumUtils";

type Props = {
	album: AlbumPreviewType;
	saved: boolean;
	rating?: number;
};

const AlbumDetail: FC<Props> = ({ album, saved, rating }) => {
 return;
};

export default AlbumDetail;
