import { Stack, Typography,Box } from "@mui/material";
import Image from "next/legacy/image";
import React from "react";
import client from "./../../config/contentful";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export const getStaticPaths = async () => {
  const response = await client.getEntries({
    content_type: "trips",
  });

  // {params: {slug:val}}

  const paths = response.items.map((trip) => {
    return {
      params: {
        slug: trip.fields.slug,
      },
    };
  });

  console.log("Paths");
  console.log(paths);
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  console.log("Params");
  console.log(params);
  const response = await client.getEntries({
    content_type: "trips",
    "fields.slug": params.slug,
  });

  return {
    props: {
      trip: response.items[0],
    },
    revalidate: 1
  };
};

const TripDetail = ({ trip }) => {
  console.log(trip);
  const { title, brief, contentImage, attractions, description } = trip.fields;
  return (
    <Stack spacing={5} mb={10}>
      <Image
        src={`https:${contentImage.fields.file.url}`}
        alt="Content Image"
        width={1200}
        height={600}
        layout='responsive'
      />
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight='bold'>{title}</Typography>
        <Typography variant="h6" color='#7c7f7c'>{brief}</Typography>
      </Stack>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight='500' >Attractions:</Typography>
        <Stack direction='row'>
          {
            attractions && attractions.map((attraction,index) => {
              return <Typography variant="subtitle1" key={index} color='#7c7f7c'>{`${attraction},`}</Typography>
            })
          }
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight='500'>Description:</Typography>
        <Box>{documentToReactComponents(description)}</Box>
      </Stack>
    </Stack>
  );
};

export default TripDetail;
