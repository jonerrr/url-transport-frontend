import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import {
  Stack,
  FormControl,
  Input,
  Button,
  useColorModeValue,
  Heading,
  Text,
  Container,
  Flex,
  Divider,
  Skeleton,
  Link,
} from "@chakra-ui/react";
import { CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const backendUrl = "https://transfer.jonah.sh:8080";

export default function Submit() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"initial" | "submitting" | "success">(
    "initial"
  );
  const [error, setError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/get`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setLoaded(true);
          return;
        }
        setCurrentUrl(data.url);
        setLoaded(true);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !url.match(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
      )
    ) {
      setError(true);
      await sleep(5000);
      setState("initial");
      setError(false);
      return;
    }

    setState("submitting");
    setError(false);
    try {
      setState("submitting");
      setLoaded(false);
      fetch(`${backendUrl}/set`, {
        body: JSON.stringify({ url }),
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.error) {
            setError(true);
            await sleep(5000);
            setState("initial");
            setError(false);
            return;
          }

          setLoaded(true);
          fetch(`${backendUrl}/get`)
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                setError(true);
                return;
              }
              setCurrentUrl(data.url);
              setLoaded(true);
            });
          setState("initial");
          setUrl("");
        });
    } catch (err) {
      setError(true);
      await sleep(1000);
      setState("initial");
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Container
        maxW={"lg"}
        bg={useColorModeValue("white", "whiteAlpha.100")}
        boxShadow={"xl"}
        rounded={"lg"}
        p={6}
        direction={"column"}
      >
        <Heading
          as={"h2"}
          fontSize={{ base: "xl", sm: "2xl" }}
          textAlign={"center"}
          mb={5}
        >
          Create URL
        </Heading>
        <Stack
          direction={{ base: "column", md: "row" }}
          as={"form"}
          spacing={"12px"}
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <FormControl>
            <Input
              variant={"solid"}
              borderWidth={1}
              color={"gray.800"}
              _placeholder={{
                color: "gray.400",
              }}
              borderColor={useColorModeValue("gray.300", "gray.700")}
              id={"email"}
              required
              placeholder={"https://example.com"}
              aria-label={"Your URL"}
              value={url}
              disabled={state !== "initial"}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUrl(e.target.value)
              }
            />
          </FormControl>
          <FormControl w={{ base: "100%", md: "40%" }}>
            <Button
              colorScheme={state === "success" ? "green" : "blue"}
              isLoading={state === "submitting"}
              w="100%"
              type={state === "success" ? "button" : "submit"}
            >
              {state === "success" ? <CheckIcon /> : "Submit"}
            </Button>
          </FormControl>
        </Stack>
        <Text
          mt={2}
          textAlign={"center"}
          color={error ? "red.500" : "gray.500"}
        >
          {error ? "Invalid URL" : ""}
        </Text>

        {/*add switch case here*/}
        <Divider pt={5} />

        <Heading
          as={"h2"}
          fontSize={{ base: "xl", sm: "2xl" }}
          textAlign={"center"}
          mb={5}
          pt={5}
        >
          Current URL
        </Heading>
        <Skeleton isLoaded={loaded}>
          {currentUrl === "" ? (
            <Text pl={3} color={"gray.500"}>
              No URL has been created yet
            </Text>
          ) : (
            <Link pl={3} href={currentUrl} isExternal>
              {currentUrl} <ExternalLinkIcon mx="2px" />
            </Link>
          )}
        </Skeleton>
      </Container>
    </Flex>
  );
}
