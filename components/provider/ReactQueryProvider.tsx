import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/react-query';
import Loader from '../Loader';

const queryClient = new QueryClient();

function LoaderProvider({ children }: React.PropsWithChildren) {
  const isFetching = useIsFetching()

  if(isFetching) return <Loader/>

  return children

}

export default function ReactQueryProvider({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <LoaderProvider>
        {children}
      </LoaderProvider>
    </QueryClientProvider>
  );
}