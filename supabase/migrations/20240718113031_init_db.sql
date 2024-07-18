create extension if not exists "vector" with schema "extensions";

CREATE TABLE public.registered_documents (
    id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    source_url text NOT NULL,
    source_type text NOT NULL,
    registered_at timestamp NOT NULL,
    metadata jsonb
);

ALTER TABLE public.registered_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow authenticated to access own registered_documents"
    ON public.registered_documents
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

CREATE TABLE public.processed_documents(
    id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    file_checksum text not null,
    file_size integer not null,
    num_pages integer not null,
    processing_started_at timestamp,
    processing_finished_at timestamp,
    processing_error text,
    registered_document_id integer REFERENCES public.registered_documents(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.processed_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow authenticated to access own processed_documents"
    ON public.processed_documents
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

CREATE TABLE public.processed_document_summaries(
    id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    summary text not null,
    summary_embedding vector(1536) not null,
    tags text [] not null,
    processed_document_id integer REFERENCES public.processed_documents(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
    );
ALTER TABLE public.processed_document_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow authenticated to access own processed_document_summaries"
    ON public.processed_document_summaries
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

CREATE TABLE public.processed_document_chunks(
    id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    content text not null,
    embedding vector(1536) not null,
    page integer not null,
    chunk_index integer not null,
    processed_document_id integer REFERENCES public.processed_documents(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.processed_document_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow authenticated to access own processed_document_chunks"
    ON public.processed_document_chunks
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

insert into storage.buckets (id, name, public)  values ('documents', 'documents', false);

create policy "Allow insert to documents bucket for authenticated into folder with user_id"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents' and
  (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "allow select to documents bucket for authenticated"
on storage.objects for select
to authenticated
using (
    bucket_id = 'documents' and 
    (select auth.uid()::text) = owner_id 
);