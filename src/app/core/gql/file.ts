import { gql } from 'apollo-angular';
import { Guid } from 'guid-typescript';

const get_file_url = gql`
  query get_file_url($fileName: String!, $folder: Folder) {
    get_file_url(fileName: $fileName, folder: $folder) {
      error
      code
      message
      data
    }
  }
`;

const getNewFileName = (fileName: string) => {
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  return Guid.create() + fileExtension;
};

export { get_file_url, getNewFileName };
