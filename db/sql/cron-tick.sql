-- Rode no SQL Editor do Supabase depois de ativar as extensões pg_cron e pg_net.
-- Troque os dois valores abaixo antes de rodar. Eles ficam guardados no Vault, não no texto do job.
select vault.create_secret('https://SEU-DOMINIO', 'mavik_app_url');
select vault.create_secret('MESMO_VALOR_DO_CRON_SECRET', 'mavik_cron_secret');

select cron.schedule(
  'mavik-tick',
  '* * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'mavik_app_url') || '/api/cron/tick',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'mavik_cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 55000
  );
  $$
);

-- Conferir execuções: select * from cron.job_run_details order by start_time desc limit 20;
-- Ver respostas HTTP: select * from net._http_response order by created desc limit 20;
-- Remover: select cron.unschedule('mavik-tick');
