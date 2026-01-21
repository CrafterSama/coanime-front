import { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { usePostsSettings } from '@/components/modules/posts/settings';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/Loading';
import Paginator from '@/components/ui/Paginator';
import SectionHeader from '@/components/ui/SectionHeader';
import { Rows, Table } from '@/components/ui/Table';
import { usePosts } from '@/hooks/posts';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/auth';
import { postDelete } from '@/services/posts';
import { toast } from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';

const Posts = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [postId, setPostId] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const {
    data = {},
    isLoading,
    refetch,
  } = usePosts({
    page,
    name,
  });
  const { data: posts = [] } = data;
  const { headers } = usePostsSettings({ user, setPostId, setOpenDeleteModal });

  useEffect(() => {
    if (router?.query?.page) {
      return setPage(Number(router?.query?.page));
    }
    return setPage(1);
  }, [router?.query?.page]);

  const onPageChange = async () => {
    await router.push({
      pathname: '/dashboard/posts',
      query: {
        page: page,
      },
    });
  };

  const deletePost = (id: string) => {
    setPostId(id);
    postDelete(id)
      .then(() => {
        toast.success('Post eliminado');
        refetch();
        onPageChange();
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        refetch();
        setOpenDeleteModal(false);
      });
  };

  useEffect(() => {
    onPageChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <Head>
        <title>Coanime.net - Lista de Articulos</title>
      </Head>
      <AppLayout
        header={
          <SectionHeader
            backlink="/dashboard"
            text="Lista de Articulos"
            rightElement={
              <Link
                href={`/dashboard/posts/create`}
                className="font-semibold py-2 px-4 rounded-lg transition-colors border-2 text-orange-500 bg-orange-100 border-orange-500 hover:bg-orange-200 flex flex-row justify-center items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Crear
              </Link>
            }
          />
        }>
        <Modal
          title="Borrar Post"
          isOpen={openDeleteModal}
          toggleModal={() => setOpenDeleteModal(!openDeleteModal)}>
          <div className="flex flex-col gap-8">
            <p>
              ¿Estas seguro de borrar este post? ¡Esta acción no se puede
              deshacer!
            </p>
            <div className="flex flex-row justify-end gap-4">
              <Button
                variant="link"
                onClick={() => setOpenDeleteModal(!openDeleteModal)}>
                No
              </Button>
              <Button
                suffix={<TrashIcon className="w-4 h-4" />}
                onClick={() => postId && deletePost(postId)}
                className="flex flex-row items-center gap-2">
                <span>Si</span>
              </Button>
            </div>
          </div>
        </Modal>
        <div className="py-12">
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start py-4">
              <Input
                placeholder="Buscar"
                className="w-[300px]"
                defaultValue={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>
            <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
              {isLoading && (
                <div className="flex justify-center content-center min-w-screen min-h-screen">
                  <Loading size={16} />
                </div>
              )}
              {posts && (
                <>
                  <Table columns={headers}>
                    {posts?.map((row: any) => (
                      <Rows key={row.id} columns={headers} row={row} />
                    ))}
                  </Table>
                  <Paginator page={page} setPage={setPage} data={data} />
                </>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Posts;
