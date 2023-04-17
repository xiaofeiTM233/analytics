defmodule Plausible.IngestRepo.Migrations.AddRevenueToEvents do
  use Ecto.Migration

  def change do
    alter table(:events_v2) do
      add :monetary_value, :Float64
    end
  end
end
