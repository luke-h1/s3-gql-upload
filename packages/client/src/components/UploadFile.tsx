import { gql, useMutation } from '@apollo/client';
import React from 'react';

interface UploadFileProps {

}

const SINGLE_UPLOAD = gql`
  mutation($file: Upload!){
      singleUpload(file: $file) {
          filename
          mimetype
          encoding
          url
      }
  }
`;

const UploadFile: React.FC<UploadFileProps> = () => {
  const [mutate, { loading, error }] = useMutation(SINGLE_UPLOAD);
  const onChange = ({
    target: {
      validity,
      files: [file],
    },
  }: any) => validity.valid && mutate({ variables: { file } });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error, null, 2)}</div>;

  return (
    <>
      <input type="file" required onChange={onChange} />
    </>

  );
};
export default UploadFile;
